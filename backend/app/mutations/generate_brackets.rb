class GenerateBrackets < Mutations::Command
  required do
    model :tournament
  end

  def validate
    if tournament.players.count > 32
      add_error(:tournament, :invalid, "Too many players for this tournament")
    elsif tournament.players.count < 3
      add_error(:tournament, :invalid, "Too few players for this tournament")
    end
  end


  def execute
    tournament.bracket = generateTree(tournament.players.to_a, 1)
  end

  private

  def generateTree(players, matchNumber)
    if players.size > 2
      middle = (players.size.to_f / 2).ceil
      halfs = players.in_groups_of(middle, false)

      Bracket.create(matchNumber: matchNumber).tap do |bracket|
        bracket.left_branch = generateTree(halfs[0], matchNumber + 1)
        bracket.right_branch = generateTree(halfs[1], matchNumber + 1)
      end
    else
      Bracket.create(matchNumber: matchNumber).tap do |bracket|
        if players.size == 1
          bracket.winner = players[0]
        else
          bracket.game = NewGame.run!(players: players)
        end
      end
    end
  end
end