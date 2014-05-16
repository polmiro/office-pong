describe ReportGame do
  let!(:game_rule) do
    GameRule.create(:sets => 1, :score => 21)
  end

  let(:players) do
    [
      Player.create!(:name => "Pol", :email => "pol@quri.com"),
      Player.create!(:name => "Beau", :email => "beau@quri.com")
    ]
  end

  let(:valid_report) do
    {}.tap do |hash|
      hash[players[0].id] = [21]
      hash[players[1].id] = [14]
    end
  end

  it "raises error when players not found" do
    report = {}.tap do |hash|
      hash[212323515] = [21]
      hash[239387238] = [19]
    end

    expect {
      ReportGame.run!(:report => report)
    }.to raise_error(Mutations::ValidationException)
  end

  it "raises error when not exactly two players" do
    expect {
      ReportGame.run!(:report => {})
    }.to raise_error(Mutations::ValidationException)
  end

  it "raises error when invalid number of sets" do
    report = {}.tap do |hash|
      hash[players[0].id] = [21, 21]
      hash[players[1].id] = [19, 19]
    end

    expect {
      ReportGame.run!(:report => report)
    }.to raise_error(Mutations::ValidationException)
  end

  it "raises error when invalid set scores" do
    report = {}.tap do |hash|
      hash[players[0].id] = [21, 23]
      hash[players[1].id] = [14, 22]
    end

    expect {
      ReportGame.run!(:report => report)
    }.to raise_error(Mutations::ValidationException)
  end

  it "creates the correct amount of sets" do
    game = ReportGame.run!(:report => valid_report)
    expect(game.game_sets.count).to eql(1)
  end

  it "assigns a winner of each set" do
    game = ReportGame.run!(:report => valid_report)
    expect(game.game_sets.first.winner).to eql(players[0])
  end

  it "assigns a loser of each set" do
    game = ReportGame.run!(:report => valid_report)
    expect(game.game_sets.first.loser).to eql(players[1])
  end

  it "assigns a winner of the game" do
    game = ReportGame.run!(:report => valid_report)
    expect(game.winner).to eql(players[0])
  end

  it "assigns a loser of the game" do
    game = ReportGame.run!(:report => valid_report)
    expect(game.loser).to eql(players[1])
  end

  it "assigns the correct scores for each player/set winner" do
    game = ReportGame.run!(:report => valid_report)
    scores = game.game_sets.first.scores
    score_rel = game.game_sets.first.rels(:type => "GameSet#scores", :between => players[0]).first
    expect(score_rel.get_property("value").to_i).to eql(21)
  end

  it "assigns the correct scores for each player/set loser" do
    game = ReportGame.run!(:report => valid_report)
    scores = game.game_sets.first.scores
    score_rel = game.game_sets.first.rels(:type => "GameSet#scores", :between => players[1]).first
    expect(score_rel.get_property("value").to_i).to eql(14)
  end
end