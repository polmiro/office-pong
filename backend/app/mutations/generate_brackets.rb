class GenerateBrackets < Mutations::Command
  MIN_PLAYERS = 3

  required do
    model :tournament
  end

  optional do
    boolean :shuffle
  end

  def validate
    if tournament.players.count < MIN_PLAYERS
      add_error(:tournament, :invalid, "Too few players for this tournament")
    end
  end

  def execute
    players = tournament.players.to_a
    players.shuffle! if shuffle
    tournament.bracket = generateTree(tournament.players.to_a, 0)
  end

  private

  def generateTree(players, round)
    if players.size > 2
      middle = (players.size.to_f / 2).ceil
      halfs = players.in_groups_of(middle, false)

      Bracket.create(round: round).tap do |bracket|
        bracket.left_bracket = generateTree(halfs[0], round + 1)
        bracket.right_bracket = generateTree(halfs[1], round + 1)
      end
    else
      Bracket.create(round: round).tap do |bracket|
        if players.size == 1
          bracket.winner = players[0]
        else
          bracket.game = NewGame.run!(players: players)
        end
      end
    end
  end
end