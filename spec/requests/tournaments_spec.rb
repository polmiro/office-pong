describe "/api/v1/tournaments", :type => "request" do
  let!(:pol) { Player.create!(:name => "Pol", :email => "pol@quri.com") }
  let!(:travis) { Player.create!(:name => "Travis", :email => "travis@quri.com") }
  let!(:beau)  { Player.create!(:name => "Beau", :email => "beau@quri.com") }

  let!(:tournament) do
    Tournament.create!(:title => "I Quri Grand Slam").tap do|t|
      t.players << pol << travis << beau
      t.game_rule = GameRule.create(:sets => 3, :score => 21)
      GenerateBrackets.run!(:tournament => t)
    end
  end

  describe "GET '/tournaments'" do
    before { get "/api/v1/tournaments" }

    it "returns 200 status" do
      expect(response.status).to eql(200)
    end

    it "returns an array of json tournaments" do
      expect(JSON.parse(response.body)).to be_present
    end
  end

  describe "GET /tournaments/:id" do
    before { get "/api/v1/tournaments/#{tournament.id}" }

    it "returns 200 status" do
      expect(response.status).to eql(200)
    end

    it "returns the tournament's json" do
      expect(JSON.parse(response.body)).to be_present
    end
  end
end