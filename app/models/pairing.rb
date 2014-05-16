class Pairing
  include Neo4j::ActiveNode
  has_n(:players).to(Player)
  has_n(:games).from(Game, :pairing)
end