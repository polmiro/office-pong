class ReportGame < Mutations::Command

  def validate
    validate_players
    validate_sets
  end

  def execute
    Game.create.tap do |game|
      game.pairing = FindPairing.run!(players: players)

      sets_won_0 = 0
      sets_won_1 = 0

      (number_of_sets).times.each do |set_index|
        GameSet.create.tap do |game_set|
          game_set.game = game
          score_0 = report[players[0].id][set_index].to_i
          score_1 = report[players[1].id][set_index].to_i
          game_set.scores.create(players[0],:value => score_0)
          game_set.scores.create(players[1],:value => score_1)

          if score_0 > score_1
            game_set.winner, game_set.loser = players[0], players[1]
            sets_won_0 += 1
          else
            game_set.winner, game_set.loser = players[1], players[0]
            sets_won_1 += 1
          end
        end
      end

      if sets_won_0 > sets_won_1
        game.winner, game.loser = players[0], players[1]
      else
        game.winner, game.loser = players[1], players[0]
      end
    end
  end

  private

  def players
    @players ||= report.keys.map { |key| Player.find(key) }
  end

  def report
    raw_inputs[:report]
  end

  def number_of_sets
    report.values.first.size
  end

  def validate_players
    if players.size != 2
      add_error(:report, :invalid, "Invalid number of players in report data")
    end
  end

  def validate_sets
    unless GameRule.rule.validate_sets(*report.values.map { |r| r.map(&:to_i) })
      add_error(:report, :invalid, "Invalid sets report data")
    end
  end
end