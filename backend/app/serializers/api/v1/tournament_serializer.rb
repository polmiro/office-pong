class Api::V1::TournamentSerializer < Api::V1::ApplicationSerializer
  attributes :id, :title, :created_at, :updated_at
end
