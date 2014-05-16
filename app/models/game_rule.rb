class GameRule
  SETS = [1, 3, 5, 7]
  SCORE = [11, 21]

  include Neo4j::ActiveNode

  property :sets,           :type => Integer, :default => 1
  property :score,          :type => Integer, :default => 21
  property :created_at,     :type => DateTime
  property :updated_at,     :type => DateTime

  index :sets
  index :score

  validates :sets,  :presence => true, :inclusion => { :in => SETS }
  validates :score, :presence => true, :inclusion => { :in => SCORE }

  def self.rule
    find(:sets => 1, :score => 21)
  end

  def validate_sets(x, y)
    if SETS.include?(x.size) && SETS.include?(y.size) && x.size == y.size
      x.each_with_index.all?{|_, i| validate_score(x[i], y[i]) }
    end
  end

  def validate_score(x, y)
    x, y = y, x if x < y
    x > score && y == x - 2 || x == score && y <= x - 2
  end
end