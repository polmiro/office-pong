class Pairing
  include Neo4j::ActiveNode
  has_n(:players).to(Player)
end