class Game
  include Neo4j::ActiveNode

  property :created_at,     :type => DateTime
  property :updated_at,     :type => DateTime

  has_one(:pairing).to(Pairing)
  has_one(:winner).to(Player)
  has_one(:loser).to(Player)
  has_one(:game_rule).to(GameRule)
  has_n(:game_sets).to(GameSet)
end