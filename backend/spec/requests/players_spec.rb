describe "/api/v1/players", :type => "request" do
  let!(:pol) { Player.create!(:name => "Pol", :email => "pol@quri.com") }

  describe "GET '/players'" do
    before { get "/api/v1/players" }

    it "returns 200 status" do
      expect(response.status).to eql(200)
    end

    it "returns an array of json players" do
      expect(JSON.parse(response.body)).to be_present
    end
  end

  describe "GET /players/:id" do
    before { get "/api/v1/players/#{pol.id}" }

    it "returns 200 status" do
      expect(response.status).to eql(200)
    end

    it "returns the player's json" do
      expect(JSON.parse(response.body)).to be_present
    end
  end
end