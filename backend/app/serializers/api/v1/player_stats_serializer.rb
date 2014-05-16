class Api::V1::PlayerStatsSerializer < Api::V1::ApplicationSerializer
  has_one :worst_defeat,     :serializer => Api::V1::GameSerializer
  has_one :greatest_victory, :serializer => Api::V1::GameSerializer

  attributes :points_won_count,
             :points_lost_count,
             :games_lost_count,
             :games_won_count,
             :tournaments_won_count
end

