class Bracket
  NAMES = %w(final semifinal quarterfinal eliminatory)

  include Neo4j::ActiveNode

  property :matchNumber,    :type => Integer
  property :created_at,     :type => DateTime
  property :updated_at,     :type => DateTime

  validates :matchNumber, :presence => true, :numericality => { :only_integer => true }

  has_one(:left_bracket).to(Bracket)
  has_one(:right_bracket).to(Bracket)
  has_one(:game).to(Game)
  has_one(:winner).to(Player)

  def name
    NAMES[matchNumber] || NAMES.last
  end
end