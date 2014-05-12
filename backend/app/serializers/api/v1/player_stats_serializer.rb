class Api::V1::PlayerStatsSerializer < Api::V1::ApplicationSerializer
  attributes :points_won_count,
             :points_lost_count,
             :games_lost_count,
             :games_won_count,
             :tournaments_won_count,
             :worst_defeat,
             :greatest_victory
end

