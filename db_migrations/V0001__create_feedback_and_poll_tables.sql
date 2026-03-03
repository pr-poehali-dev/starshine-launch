
CREATE TABLE IF NOT EXISTS t_p78551442_starshine_launch.feedback (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p78551442_starshine_launch.poll_votes (
  id SERIAL PRIMARY KEY,
  option_key TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
