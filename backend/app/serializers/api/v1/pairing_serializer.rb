class Api::V1::PairingSerializer < Api::V1::ApplicationSerializer
  attributes :id

  has_many :players, :each_serializer => PlayerSerializer
end
