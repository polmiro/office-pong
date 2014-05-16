class Api::V1::PlayerSerializer < Api::V1::ApplicationSerializer
  attributes :id, :name, :created_at, :email, :avatar_url
end
