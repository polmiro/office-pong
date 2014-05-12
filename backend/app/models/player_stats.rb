class PlayerStats
  include ActiveModel::SerializerSupport

  def initialize(player)
    @player = player
  end

  def points_won_count
    1500
  end

  def points_lost_count
    2000
  end

  def games_lost_count
    @player.lost_games.count
  end

  def games_won_count
    @player.won_games.count
  end

  def tournaments_won_count
    @player.won_tournaments.count
  end

  def worst_defeat
    Game.all.next
  end

  def greatest_victory
    Game.all.next
  end
end