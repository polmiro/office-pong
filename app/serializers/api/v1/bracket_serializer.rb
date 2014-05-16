class Api::V1::BracketSerializer < Api::V1::ApplicationSerializer
  attributes :id

  has_one :left_bracket,  :serializer => Api::V1::BracketSerializer
  has_one :right_bracket, :serializer => Api::V1::BracketSerializer
  has_one :game,          :serializer => Api::V1::GameSerializer
  has_one :winner,     :serializer => Api::V1::PlayerSerializer
end
