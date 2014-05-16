class NewGame < Mutations::Command
  required do
    array :players
  end

  def validate
    if players.size != 2
      add_error(:players, :invalid, "Two players needed to create a game")
    end
  end

  def execute
    Game.create.tap do |game|
      game.pairing = FindPairing.run!(players: players)
    end
  end
end