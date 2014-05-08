class NewGame < Mutations::Command
  required do
    array :players
  end

  def execute
    Game.create.tap do |game|
      game.pairing = FindPairing.run!(players: players)
    end
  end
end