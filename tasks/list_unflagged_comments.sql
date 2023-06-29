SELECT
  id,
  comment,
  flagged
FROM
  comments
WHERE
  flagged = false
;