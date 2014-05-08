class Tournament
  include Neo4j::ActiveNode

  property :title,          :class => String
  property :created_at,     :type => DateTime
  property :updated_at,     :type => DateTime

  has_n(:players).to(Player)
  has_one(:game_rule).to(GameRule)
  has_one(:winner).to(Player)
  has_one(:bracket).to(Bracket)
end