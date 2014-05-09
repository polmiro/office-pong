class GameSet
  include Neo4j::ActiveNode

  property :created_at,     :type => DateTime
  property :updated_at,     :type => DateTime

  has_one(:game).from(Game, :game_sets)
  has_n(:scores)
end