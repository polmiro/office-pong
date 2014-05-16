class Api::V1::GameSerializer < Api::V1::ApplicationSerializer
  attributes :id, :created_at, :updated_at, :loser, :winner, :sets

  has_one  :pairing,   :serializer => Api::V1::PairingSerializer

  def loser
    if object.loser
      {
        :player_id => object.loser.id,
        :sets      => won_sets_for(object.loser)
      }
    end
  end

  def winner
    if object.winner
      {
        :player_id => object.winner.id,
        :sets      => won_sets_for(object.winner)
      }
    end
  end

  def sets
    object.game_sets.map do |game_set|
      pairing.players.map do |player|
        {
          :player_id => player.id,
          :score     => score_for(player, game_set)
        }
      end
    end
  end

  private

  def won_sets_for(player)
    object.game_sets.reduce(0) do |count, game_set|
      count += 1 if game_set.winner == player
      count
    end
  end

  def score_for(player, game_set)
    game_set.rels(:type => "GameSet#scores", :between => player).first.get_property("value").to_i
  end
end
