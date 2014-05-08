module Api
  module V1
    class ApplicationController < ActionController::Base
      protect_from_forgery with: :null_session

      respond_to :json

      # Order of rescue_from statements is important

      rescue_from StandardError do |e|
        log_fatal_error(e)
        render :status => :internal_server_error,
               :json => ApiError.new(e),
               :serializer => ApiErrorSerializer
      end

      rescue_from Mutations::ValidationException do |e|
        log_error(e)
        render :status => :unprocessable_entity,
               :json => ApiError.new(e),
               :serializer => UnprocessableEntityErrorSerializer
      end

      protected

      def log_error(error)
        logger.debug(error)
      end

      def log_fatal_error(error)
        logger.fatal(error)
      end

      def default_serializer_options
        {}
      end

    end
  end
end
