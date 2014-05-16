class Department
  include Neo4j::ActiveNode

  property :name,       :type => String
  property :created_at, :type => DateTime
  property :updated_at, :type => DateTime

  validates :name,  presence: true

  index :name

  has_n(:employees).to(Player)
end