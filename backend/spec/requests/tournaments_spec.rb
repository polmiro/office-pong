describe "/api/v1/tournaments", :type => "request" do
  let!(:tournament) do
    Tournament.create!(:title => "I Quri Grand Slam").tap do|t|
      t.game_rule = GameRule.create(:sets => 3, :score => 21)
    end
  end

  let(:tournament_json) do
    {
      id: tournament.id,
      title: "I Quri Grand Slam",
      created_at: tournament.created_at.as_json,
      updated_at: tournament.updated_at.as_json,
    }.with_indifferent_access
  end

  describe "GET '/tournaments'" do
    before { get "/api/v1/tournaments" }

    it "returns 200 status" do
      expect(response.status).to eql(200)
    end

    it "returns an array of json tournaments" do
      expect(JSON.parse(response.body)).to eql([tournament_json])
    end
  end

  describe "GET /tournaments/:id" do
    before { get "/api/v1/tournaments/#{tournament.id}" }

    it "returns 200 status" do
      expect(response.status).to eql(200)
    end

    it "returns the tournament's json" do
      expect(JSON.parse(response.body)).to eql(tournament_json)
    end
  end
end