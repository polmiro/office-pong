class Bracket
  NAMES = %w(final semifinal quarterfinal eliminatory)

  include Neo4j::ActiveNode

  property :created_at,     :type => DateTime
  property :updated_at,     :type => DateTime

  has_one(:left_bracket).to(Bracket)
  has_one(:right_bracket).to(Bracket)
  has_one(:game).to(Game)
  has_one(:winner).to(Player)
end