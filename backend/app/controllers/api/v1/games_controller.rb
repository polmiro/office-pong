module Api
  module V1
    class GamesController < Api::V1::ApplicationController
      def index
        render :json => Game.all.to_a,
               :serializer => ActiveModel::ArraySerializer,
               :each_serializer => GameSerializer
      end

      def show
        render :json => Game.find(params[:id]),
               :serializer => GameSerializer
      end

      def create
        render :json => ReportGame.run!(:report => params[:report])
               :serializer => GameSerializer
      end
    end
  end
end
