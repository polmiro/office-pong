describe NewGame do
  let(:players) do
    [
      Player.create!(:name => "Pol", :email => "pol@quri.com"),
      Player.create!(:name => "Beau", :email => "beau@quri.com")
    ]
  end

  it "raises error when there are not two players" do
    expect {
      NewGame.run!(:players => [])
    }.to raise_error(Mutations::ValidationException)
  end

  it "creates a game" do
    expect {
      NewGame.run!(:players => players)
    }.to change(Game, :count).by(1)
  end

  it "adds the corresponding pairing to the game" do
    game = NewGame.run!(:players => players)
    expect(game.pairing.players.to_a).to match_array(players)
  end
end