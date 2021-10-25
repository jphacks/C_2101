package dev.abelab.jphacks.helper.sample;

import dev.abelab.jphacks.db.entity.Participation;

/**
 * Participation Sample Builder
 */
public class ParticipationSample extends AbstractSample {

	public static ParticipationSampleBuilder builder() {
		return new ParticipationSampleBuilder();
	}

	public static class ParticipationSampleBuilder {

		private Integer userId = SAMPLE_INT;
		private Integer roomId = SAMPLE_INT;
		private Integer type = SAMPLE_INT;
		private String title = SAMPLE_STR;

		public ParticipationSampleBuilder userId(Integer userId) {
			this.userId = userId;
			return this;
		}

		public ParticipationSampleBuilder roomId(Integer roomId) {
			this.roomId = roomId;
			return this;
		}

		public ParticipationSampleBuilder type(Integer type) {
			this.type = type;
			return this;
		}

		public ParticipationSampleBuilder title(String title) {
			this.title = title;
			return this;
		}

		public Participation build() {
			return Participation.builder() //
				.userId(this.userId) //
				.roomId(this.roomId) //
				.type(this.type) //
				.title(this.title) //
				.build();
		}

	}

}
