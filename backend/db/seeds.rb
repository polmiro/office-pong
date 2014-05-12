# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create!([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create!(name: 'Emanuel', city: cities.first)

Neo4j::Session.current.query <<-CYPHER
  MATCH (n)
  OPTIONAL MATCH (n)-[r]-()
  DELETE n,r
CYPHER

pol     = Player.create!(:name => "Pol",     :email => "pol@quri.com")
beau    = Player.create!(:name => "Beau",    :email => "beau@quri.com")
nick    = Player.create!(:name => "Nick",    :email => "nick@quri.com")
matt    = Player.create!(:name => "Matt",    :email => "matt@quri.com")
t2      = Player.create!(:name => "T2",      :email => "t2@quri.com")
brian   = Player.create!(:name => "Brian",   :email => "brian@quri.com")
loic    = Player.create!(:name => "Loic",    :email => "loic@quri.com")
sebas   = Player.create!(:name => "Sebas",   :email => "sebastien@quri.com")
vish    = Player.create!(:name => "Vish",    :email => "vish@quri.com")
brennan = Player.create!(:name => "Brennan", :email => "brennan@quri.com")

engineering = Department.create!(:name => "Engineering")
ops         = Department.create!(:name => "Ops")
sales       = Department.create!(:name => "Sales")

pol.department = engineering
nick.department = engineering
brian.department = engineering
loic.department = engineering
sebas.department = engineering

beau.department = ops
vish.department = ops
t2.department = ops

matt.department = sales
brennan.department = sales

GameRule::SETS.product(GameRule::SCORE) do |combination|
  GameRule.create!(:sets => combination[0], :score => combination[1])
end

tournament = Tournament.create!(:title => "I Quri Grand Slam")
tournament.game_rule = GameRule.find(:sets => 3, :score => 21)

Player.all.to_a.first(6).each do |player|
  tournament.players << player
end

GenerateBrackets.run!(:tournament => tournament)
