class GameSet
  include Neo4j::ActiveNode

  property :created_at,     :type => DateTime
  property :updated_at,     :type => DateTime

  has_one(:winner).to(Player)
  has_one(:loser).to(Player)
  has_one(:game).from(Game, :game_sets)
  has_n(:scores).to(Player)
end