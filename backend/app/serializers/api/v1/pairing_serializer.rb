class Api::V1::PairingSerializer < Api::V1::ApplicationSerializer
  attributes :id

  has_many :players, :each_serializer => Api::V1::PlayerSerializer
end
