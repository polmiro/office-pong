class Api::V1::TournamentSerializer < Api::V1::ApplicationSerializer
  attributes :id, :title, :created_at, :updated_at

  has_one :bracket, :serializer => Api::V1::BracketSerializer
end
