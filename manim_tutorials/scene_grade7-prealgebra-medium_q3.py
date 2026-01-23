from manim import *

class Grade7PrealgebraMedium3(Scene):
    def construct(self):
        expression = MathTex("|-8| + |3|").scale(1.2)
        self.play(Write(expression))
        self.wait(1)

        step1 = MathTex("8 + 3").next_to(expression, DOWN, buff=0.5).scale(1.2)
        arrow1 = Arrow(expression.get_bottom(), step1.get_top(), buff=0.1)
        self.play(TransformFromCopy(expression, step1), Create(arrow1))
        self.wait(1)

        step2 = MathTex("11").next_to(step1, DOWN, buff=0.5).scale(1.2)
        arrow2 = Arrow(step1.get_bottom(), step2.get_top(), buff=0.1)
        self.play(TransformFromCopy(step1, step2), Create(arrow2))
        self.wait(1)

        self.play(FadeOut(expression, step1, step2, arrow1, arrow2))
        answer = MathTex("\text{Answer: } 11").scale(1.5)
        self.play(Write(answer))
        self.wait(2)