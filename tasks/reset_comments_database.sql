DROP TABLE comments;

CREATE TABLE IF NOT EXISTS
  comments (
    id      SERIAL PRIMARY KEY,
    comment TEXT NOT NULL,
    flagged BOOLEAN
  );

INSERT INTO
  comments (comment, flagged)
VALUES
  ('this looks so delicious omg', false),
  ('I think you suck', true),
  ('I do not want to eat this', false),
  ('eat poop', true)
;
