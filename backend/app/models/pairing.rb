class Pairing
  include Neo4j::ActiveNode
  has_n(:players).from(Player, :pairings)
end