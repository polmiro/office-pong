class Api::V1::PairingSerializer < Api::V1::ApplicationSerializer
  attributes :id

  has_many :players, :serializer => Api::V1::PlayerSerializer
end
