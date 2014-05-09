class Bracket
  NAMES = %w(final semifinal quarterfinal eliminatory)

  include Neo4j::ActiveNode

  property :round,    :type => Integer
  property :created_at,     :type => DateTime
  property :updated_at,     :type => DateTime

  validates :round, :presence => true, :numericality => { :only_integer => true }

  has_one(:left_bracket).to(Bracket)
  has_one(:right_bracket).to(Bracket)
  has_one(:game).to(Game)
  has_one(:winner).to(Player)

  def name
    NAMES[round] || NAMES.last
  end
end