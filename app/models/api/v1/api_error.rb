class Api::V1::ApiError
  include ActiveModel::Model

  attr_accessor :exception

  def initialize(exception)
    super exception: exception
  end
end