module Api
  module V1
    class TournamentsController < Api::V1::ApplicationController
      def index
        render :json => Tournament.all.to_a,
               :serializer => ActiveModel::ArraySerializer,
               :each_serializer => TournamentSerializer
      end

      def show
        render :json => Tournament.find(params[:id])
      end

      protected

      def default_serializer_options
        super.merge(:serializer => TournamentSerializer)
      end
    end
  end
end
