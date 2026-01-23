from manim import * 

class Grade7RatiosMedium2(Scene):
    def construct(self):
        map_scale = MathTex(r'1 \text{ inch} = 25 \text{ miles}').to_edge(UP)
        self.play(Write(map_scale))

        distance_on_map = MathTex(r'4 \text{ inches}').next_to(map_scale, DOWN, buff=0.5)
        self.play(Write(distance_on_map))

        actual_distance = MathTex(r'4 \text{ inches} \times 25 \frac{\text{miles}}{\text{inch}}').next_to(distance_on_map, DOWN, buff=0.5)
        self.play(Write(actual_distance))

        calculate = MathTex(r'= 100 \text{ miles}').next_to(actual_distance, RIGHT, buff=0.5)
        self.play(Write(calculate))

        self.wait(3)