class Player
  include ActiveModel::SerializerSupport
  include Neo4j::ActiveNode

  property :name,       :type => String
  property :email,      :type => String
  property :created_at, :type => DateTime
  property :updated_at, :type => DateTime

  validates :name,  presence: true
  validates :email, presence: true, :uniqueness => true

  index :name
  index :email

  has_n(:pairings).to(Pairing)
  has_n(:won_games).from(Game, :winner)
  has_n(:lost_games).from(Game, :loser)
  has_one(:department).from(Department, :employees)

  def avatar_url
    hash = Digest::MD5.hexdigest(email.downcase)
    "http://www.gravatar.com/avatar/#{hash}"
  end
end