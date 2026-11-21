-- ==============================================================================
-- ねこっぽい (Nekoppoi) アプリ利用統計集計クエリ集
-- 
-- 【概要】
-- Supabase の「SQL Editor」に貼り付けて実行することで、
-- 利用者のプライバシー（匿名性）を保ちつつ、ゲームバランス調整や改善に役立つ
-- 統計データ（おくりもの収集率、実績達成率、平均なつき度など）を確認できます。
-- 
-- 【プライバシー・オプトアウトの遵守】
-- 各クエリは、ユーザーが設定画面で「アプリ改善のための匿名の利用統計送信」を
-- オフ（false）にしているセーブデータを除外する条件
--   WHERE COALESCE((save_data->'settings'->>'analyticsEnabled')::boolean, true) = true
-- を共通で適用しています。
-- ==============================================================================


-- ------------------------------------------------------------------------------
-- 1. 全体サマリー（総ユーザー数、統計許可ユーザー数、オプトアウト率）
-- ------------------------------------------------------------------------------
SELECT
  COUNT(*) AS total_users,
  COUNT(*) FILTER (WHERE COALESCE((save_data->'settings'->>'analyticsEnabled')::boolean, true) = true) AS analytics_allowed_users,
  COUNT(*) FILTER (WHERE (save_data->'settings'->>'analyticsEnabled')::boolean = false) AS opt_out_users,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE COALESCE((save_data->'settings'->>'analyticsEnabled')::boolean, true) = true) / NULLIF(COUNT(*), 0),
    1
  ) AS allowed_rate_percent
FROM user_saves
WHERE save_data IS NOT NULL;


-- ------------------------------------------------------------------------------
-- 2. おくりもの収集率ランキング
-- 各おくりものについて、所持しているユーザー数・全許可ユーザーに対する所持割合(%)、
-- および全ユーザーが受け取った総個数を集計します。
-- （ドロップ率の調整や特定のおくりものがレアすぎないかの検証に利用）
-- ------------------------------------------------------------------------------
WITH allowed_saves AS (
  SELECT id, save_data
  FROM user_saves
  WHERE save_data IS NOT NULL
    AND COALESCE((save_data->'settings'->>'analyticsEnabled')::boolean, true) = true
),
total_valid AS (
  SELECT COUNT(*) AS total_count FROM allowed_saves
),
gifts_expanded AS (
  SELECT
    s.id AS user_id,
    g.key AS gift_id,
    (g.value->>'count')::int AS gift_count
  FROM allowed_saves s,
  LATERAL jsonb_each(s.save_data->'gifts') AS g
  WHERE (g.value->>'count')::int > 0
)
SELECT
  ge.gift_id,
  COUNT(DISTINCT ge.user_id) AS holding_users,
  ROUND(100.0 * COUNT(DISTINCT ge.user_id) / NULLIF((SELECT total_count FROM total_valid), 0), 1) AS holding_rate_percent,
  SUM(ge.gift_count) AS total_collected_count,
  ROUND(AVG(ge.gift_count), 2) AS avg_count_per_holder
FROM gifts_expanded ge
GROUP BY ge.gift_id
ORDER BY holding_users DESC, total_collected_count DESC;


-- ------------------------------------------------------------------------------
-- 3. 実績（トロフィー）達成率ランキング
-- 各実績を達成しているユーザー数と、全体の達成率(%)を算出します。
-- （難易度が高すぎる実績や、序盤で多くの人が達成している実績の確認に利用）
-- ------------------------------------------------------------------------------
WITH allowed_saves AS (
  SELECT id, save_data
  FROM user_saves
  WHERE save_data IS NOT NULL
    AND COALESCE((save_data->'settings'->>'analyticsEnabled')::boolean, true) = true
),
total_valid AS (
  SELECT COUNT(*) AS total_count FROM allowed_saves
),
achievements_expanded AS (
  SELECT
    s.id AS user_id,
    a.key AS achievement_id
  FROM allowed_saves s,
  LATERAL jsonb_each(s.save_data->'achievements') AS a
  WHERE a.value = 'true'::jsonb OR (a.value->>'unlocked')::boolean = true
)
SELECT
  ae.achievement_id,
  COUNT(DISTINCT ae.user_id) AS unlocked_users,
  ROUND(100.0 * COUNT(DISTINCT ae.user_id) / NULLIF((SELECT total_count FROM total_valid), 0), 1) AS unlock_rate_percent
FROM achievements_expanded ae
GROUP BY ae.achievement_id
ORDER BY unlock_rate_percent DESC, unlocked_users DESC;


-- ------------------------------------------------------------------------------
-- 4. 猫ごとのなつき度進捗・Lv.10達成率
-- 黒猫(black)、白猫(white)、三毛猫(calico)それぞれの平均なつき度レベルや
-- カンスト（Lv.10）達成者数を算出します。
-- （特定の猫ばかりお世話されていないか、満遍なく愛されているかの確認に利用）
-- ------------------------------------------------------------------------------
WITH allowed_saves AS (
  SELECT id, save_data
  FROM user_saves
  WHERE save_data IS NOT NULL
    AND COALESCE((save_data->'settings'->>'analyticsEnabled')::boolean, true) = true
),
total_valid AS (
  SELECT COUNT(*) AS total_count FROM allowed_saves
),
cats_affection AS (
  SELECT
    s.id AS user_id,
    c.key AS cat_id,
    COALESCE((c.value->>'level')::int, 1) AS affection_level
  FROM allowed_saves s,
  LATERAL jsonb_each(s.save_data->'affection') AS c
)
SELECT
  ca.cat_id,
  ROUND(AVG(ca.affection_level), 2) AS avg_affection_level,
  COUNT(DISTINCT ca.user_id) FILTER (WHERE ca.affection_level >= 10) AS max_level_users,
  ROUND(
    100.0 * COUNT(DISTINCT ca.user_id) FILTER (WHERE ca.affection_level >= 10) / NULLIF((SELECT total_count FROM total_valid), 0),
    1
  ) AS max_level_rate_percent
FROM cats_affection ca
GROUP BY ca.cat_id
ORDER BY ca.cat_id;


-- ------------------------------------------------------------------------------
-- 5. プレイスタイル・ふれあい統計
-- ごはん、おもちゃ、なでなでの平均実行回数や、自動ごはん機能の普及率を集計します。
-- ------------------------------------------------------------------------------
WITH allowed_saves AS (
  SELECT
    id,
    save_data,
    COALESCE((save_data->'careJournal'->>'totalFeedCount')::int, 0) AS feed_count,
    COALESCE((save_data->'careJournal'->>'totalPlayCount')::int, 0) AS play_count,
    COALESCE((save_data->'careJournal'->>'totalPetCount')::int, 0) AS pet_count,
    COALESCE((save_data->'careJournal'->>'totalActiveDays')::int, 0) AS active_days,
    COALESCE((save_data->'careJournal'->>'maxStreakDays')::int, 0) AS max_streak,
    COALESCE((save_data->'settings'->>'autoFeedEnabled')::boolean, false) AS auto_feed_on
  FROM user_saves
  WHERE save_data IS NOT NULL
    AND COALESCE((save_data->'settings'->>'analyticsEnabled')::boolean, true) = true
)
SELECT
  COUNT(*) AS total_analyzed_users,
  ROUND(AVG(feed_count), 1) AS avg_feed_count,
  ROUND(AVG(play_count), 1) AS avg_play_count,
  ROUND(AVG(pet_count), 1) AS avg_pet_count,
  ROUND(AVG(active_days), 1) AS avg_active_days,
  ROUND(AVG(max_streak), 1) AS avg_max_streak,
  COUNT(*) FILTER (WHERE auto_feed_on = true) AS auto_feed_enabled_users,
  ROUND(100.0 * COUNT(*) FILTER (WHERE auto_feed_on = true) / NULLIF(COUNT(*), 0), 1) AS auto_feed_rate_percent
FROM allowed_saves;
