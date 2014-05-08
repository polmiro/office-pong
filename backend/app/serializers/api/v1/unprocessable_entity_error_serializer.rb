class Api::V1::UnprocessableEntityErrorSerializer < Api::V1::ApiErrorSerializer
  attributes :errors

  def errors
    errors_for_mutation_exception
  end

  private

  def errors_for_mutation_exception
    object.exception.errors.map do |error|
      {
        field: error[0],
        message: error[1].message_list
      }
    end
  end

end
