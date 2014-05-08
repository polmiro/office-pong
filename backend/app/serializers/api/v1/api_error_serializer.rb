class Api::V1::ApiErrorSerializer < Api::V1::ApplicationSerializer
  attributes :message

  def message
    case object.exception
    when Mutations::ValidationException
      "Validation failed"
    else
      "Unknown exception"
    end
  end
end
