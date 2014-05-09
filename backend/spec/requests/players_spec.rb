describe "/api/v1/players", :type => "request" do
  let!(:pol) { Player.create!(:name => "Pol", :email => "pol@quri.com") }

  let(:pol_json) do
    {
      id: pol.id,
      name: "Pol",
      email: "pol@quri.com",
      created_at: pol.created_at.as_json,
      avatar_url: pol.avatar_url
    }.with_indifferent_access
  end

  describe "GET '/players'" do
    before { get "/api/v1/players" }

    it "returns 200 status" do
      expect(response.status).to eql(200)
    end

    it "returns an array of json players" do
      expect(JSON.parse(response.body)).to eql([pol_json])
    end
  end

  describe "GET /players/:id" do
    before { get "/api/v1/players/#{pol.id}" }

    it "returns 200 status" do
      expect(response.status).to eql(200)
    end

    it "returns the player's json" do
      expect(JSON.parse(response.body)).to eql(pol_json)
    end
  end
end