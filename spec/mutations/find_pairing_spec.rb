describe FindPairing do
  let!(:pol) { Player.create!(:name => "Pol",     :email => "pol@quri.com") }
  let!(:travis) { Player.create!(:name => "Beau",    :email => "beau@quri.com") }

  context "when it doensn't exist" do
    it "creates a pairing" do
      expect{
        FindPairing.run!(:players => [pol, travis])
      }.to change(Pairing, :count).by(1)
    end

    it "returns a pairing" do
      expect(FindPairing.run!(:players => [pol, travis]))
        .to be_instance_of(Pairing)
    end

    it "returns the correct pairing" do
      pairing = FindPairing.run!(:players => [pol, travis])
      expect(pairing.players.to_a).to match_array [pol, travis]
    end
  end

  context "when it does exist" do
    before do
      FindPairing.run!(:players => [pol, travis])
    end

    it "does NOT create a pairing" do
      expect{
        FindPairing.run!(:players => [pol, travis])
      }.not_to change(Pairing, :count)
    end

    it "returns a pairing" do
      expect(FindPairing.run!(:players => [pol, travis]))
        .to be_instance_of(Pairing)
    end

    it "returns the correct pairing" do
      pairing = FindPairing.run!(:players => [pol, travis])
      expect(pairing.players.to_a).to match_array [pol, travis]
    end
  end
end