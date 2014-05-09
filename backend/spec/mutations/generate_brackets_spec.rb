describe GenerateBrackets do
  let!(:tournament) do
    Tournament.create!(:title => "I Quri Grand Slam")
  end

  context "when tournament does NOT have not enough players" do
    it "fails" do
      expect{
        GenerateBrackets.run!(:tournament => tournament)
      }.to raise_error(Mutations::ValidationException)
    end
  end

  context "when tournament has enough players" do
    let!(:pol)   { Player.create!(:name => "Pol",     :email => "pol@quri.com") }
    let!(:beau)  { Player.create!(:name => "Beau",    :email => "beau@quri.com") }
    let!(:nick)  { Player.create!(:name => "Nick",    :email => "nick@quri.com") }
    let!(:matt)  { Player.create!(:name => "Matt",    :email => "matt@quri.com") }
    let!(:t2)    { Player.create!(:name => "T2",      :email => "t2@quri.com") }
    let!(:brian) { Player.create!(:name => "Brian",   :email => "brian@quri.com") }
    let!(:loic)  { Player.create!(:name => "Loic",    :email => "loic@quri.com") }

    before do
      Player.all.to_a.each do |player|
        tournament.players << player
      end
    end

    it "succeeds" do
      expect{
        GenerateBrackets.run!(:tournament => tournament)
      }.not_to raise_error
    end

    it "creates the correct number of bracktes" do
      expect{
        GenerateBrackets.run!(:tournament => tournament)
      }.to change(Bracket, :count).by(7)
    end

    it "creates the correct number of games" do
      expect{
        GenerateBrackets.run!(:tournament => tournament)
      }.to change(Game, :count).by(3)
    end

    it "adds the final bracket to the tournament" do
      GenerateBrackets.run!(:tournament => tournament)
      expect(tournament.bracket.name).to eql("final")
    end

    it "generates a tree of brackets" do
      GenerateBrackets.run!(:tournament => tournament)
      expect(tournament.bracket.left_branch.name).to eql("semifinal")
    end

    it "adds the player as winner in the leaf brackets with one player" do
      GenerateBrackets.run!(:tournament => tournament)
      expect(tournament.bracket.right_branch.right_branch.winner.id).to eql(loic.id)
    end

    it "creates a game in the leaf brackets with the correct players" do
      GenerateBrackets.run!(:tournament => tournament)
      expect(tournament.bracket.left_branch.left_branch.game.pairing.players).to match_array([pol, beau])
    end
  end

end