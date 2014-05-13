class Api::V1::GameSerializer < Api::V1::ApplicationSerializer
  attributes :id, :created_at, :updated_at

  has_one :pairing, :serializer => Api::V1::PairingSerializer
  has_one :winner
  has_one :loser
end
