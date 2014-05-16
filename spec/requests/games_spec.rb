describe "/api/v1/games", :type => "request" do
  let!(:pol) { Player.create!(:name => "Pol", :email => "pol@quri.com") }
  let!(:travis) { Player.create!(:name => "Travis", :email => "travis@quri.com") }
  let!(:game_rule) { GameRule.create!(:sets => 1, :score => 21) }

  let(:valid_report) do
    {}.tap do |hash|
      hash[travis.id] = [21]
      hash[pol.id] = [14]
    end
  end

  let!(:game) do
    ReportGame.run!(:report => valid_report)
  end

  describe "GET '/games'" do
    before { get "/api/v1/games" }

    it "returns 200 status" do
      expect(response.status).to eql(200)
    end

    it "returns an array of json games" do
      expect(JSON.parse(response.body)).to be_present
    end
  end

  describe "GET /games/:id" do
    before { get "/api/v1/games/#{game.id}" }

    it "returns 200 status" do
      expect(response.status).to eql(200)
    end

    it "returns the game's json" do
      expect(JSON.parse(response.body)).to be_present
    end
  end

  describe "POST /games" do
    before { post "/api/v1/games", :game => valid_report }

    it "returns 201 status" do
      expect(response.status).to eql(201)
    end

    it "returns the game's json" do
      expect(JSON.parse(response.body)).to be_present
    end
  end
end